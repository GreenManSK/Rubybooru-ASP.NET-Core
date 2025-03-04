﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Rubybooru.Data;

#nullable disable

namespace Rubybooru.Data.Migrations
{
    [DbContext(typeof(RubybooruDbContext))]
    [Migration("20250304152125_ApplyCascadeDeleteForImages")]
    partial class ApplyCascadeDeleteForImages
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Proxies:ChangeTracking", false)
                .HasAnnotation("Proxies:CheckEquality", false)
                .HasAnnotation("Proxies:LazyLoading", true);

            modelBuilder.Entity("Rubybooru.Core.BlackWhiteImage", b =>
                {
                    b.Property<int>("ImageId")
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("ImageData")
                        .HasColumnType("BLOB");

                    b.HasKey("ImageId");

                    b.ToTable("BlackWhiteImages");
                });

            modelBuilder.Entity("Rubybooru.Core.DuplicateRecord", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("ImageAId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("ImageBId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("ImageAId");

                    b.HasIndex("ImageBId");

                    b.ToTable("DuplicateRecord");
                });

            modelBuilder.Entity("Rubybooru.Core.Image", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("AddedDateTime")
                        .HasColumnType("TEXT");

                    b.Property<bool>("DuplicateCheck")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Height")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("IqdbCheckDateTime")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("Path")
                        .HasColumnType("TEXT");

                    b.Property<double>("SideRatio")
                        .HasColumnType("REAL");

                    b.Property<long>("Size")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Width")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Images");
                });

            modelBuilder.Entity("Rubybooru.Core.ImagePreview", b =>
                {
                    b.Property<int>("ImageId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Width")
                        .HasColumnType("INTEGER");

                    b.Property<int>("Height")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("KeepAspectRatio")
                        .HasColumnType("INTEGER");

                    b.Property<byte[]>("PreviewData")
                        .HasColumnType("BLOB");

                    b.HasKey("ImageId", "Width", "Height", "KeepAspectRatio");

                    b.ToTable("ImagePreviews");
                });

            modelBuilder.Entity("Rubybooru.Core.ImageTag", b =>
                {
                    b.Property<int>("ImageId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("TagId")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("UserCreated")
                        .HasColumnType("INTEGER");

                    b.HasKey("ImageId", "TagId");

                    b.HasIndex("TagId");

                    b.ToTable("ImageTag");
                });

            modelBuilder.Entity("Rubybooru.Core.Tag", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int>("Type")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("UserCreated")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.ToTable("Tags");
                });

            modelBuilder.Entity("Rubybooru.Core.TagDuplicate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int>("TargetTagId")
                        .HasColumnType("INTEGER");

                    b.HasKey("Id");

                    b.HasIndex("TargetTagId");

                    b.ToTable("TagDuplicate");
                });

            modelBuilder.Entity("Rubybooru.Core.BlackWhiteImage", b =>
                {
                    b.HasOne("Rubybooru.Core.Image", "Image")
                        .WithMany("BlackWhiteImages")
                        .HasForeignKey("ImageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Image");
                });

            modelBuilder.Entity("Rubybooru.Core.DuplicateRecord", b =>
                {
                    b.HasOne("Rubybooru.Core.Image", "ImageA")
                        .WithMany()
                        .HasForeignKey("ImageAId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Rubybooru.Core.Image", "ImageB")
                        .WithMany()
                        .HasForeignKey("ImageBId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ImageA");

                    b.Navigation("ImageB");
                });

            modelBuilder.Entity("Rubybooru.Core.ImagePreview", b =>
                {
                    b.HasOne("Rubybooru.Core.Image", "Image")
                        .WithMany("ImagePreviews")
                        .HasForeignKey("ImageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Image");
                });

            modelBuilder.Entity("Rubybooru.Core.ImageTag", b =>
                {
                    b.HasOne("Rubybooru.Core.Image", "Image")
                        .WithMany("Tags")
                        .HasForeignKey("ImageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Rubybooru.Core.Tag", "Tag")
                        .WithMany("Images")
                        .HasForeignKey("TagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Image");

                    b.Navigation("Tag");
                });

            modelBuilder.Entity("Rubybooru.Core.TagDuplicate", b =>
                {
                    b.HasOne("Rubybooru.Core.Tag", "TargetTag")
                        .WithMany()
                        .HasForeignKey("TargetTagId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("TargetTag");
                });

            modelBuilder.Entity("Rubybooru.Core.Image", b =>
                {
                    b.Navigation("BlackWhiteImages");

                    b.Navigation("ImagePreviews");

                    b.Navigation("Tags");
                });

            modelBuilder.Entity("Rubybooru.Core.Tag", b =>
                {
                    b.Navigation("Images");
                });
#pragma warning restore 612, 618
        }
    }
}
